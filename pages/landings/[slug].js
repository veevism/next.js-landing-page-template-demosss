import Layout from "../../src/components/Layout"
import Hero from "../../src/components/Hero"
import Service from "../../src/components/Service"
import About from "../../src/components/About"
import Head from "next/head"
import { isHeading } from "datocms-structured-text-utils"
import { metaTagsFragment, responsiveImageFragment } from "../../lib/fragments"
import { render as toPlainText } from "datocms-structured-text-to-plain-text"
import { request } from "../../lib/datocms"
import { StructuredText, useQuerySubscription, renderMetaTags, renderNodeRule } from "react-datocms"
import { Row, Container, Col } from "react-bootstrap"

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

export async function getStaticPaths() {
  const data = await request({ query: `{ allLandingPages { slug } }` })

  return {
    paths: data.allLandingPages.map((landing) => `/landings/${landing.slug}`),
    fallback: false,
  }
}

export async function getStaticProps({ params, preview = false }) {
  const graphqlRequest = {
    query: `
      query LandingBySlug($slug: String) {
        site: _site {
          favicon: faviconMetaTags {
            ...metaTagsFragment
          }
        }
        landingPage(filter: {slug: {eq: $slug}}) {
          slug
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
          heroTitle
          heroSubtitle
          heroImage {
            responsiveImage(imgixParams: {fm: jpg, fit: crop }) {
              ...responsiveImageFragment
            }
          }
          content {
            value
            blocks {
              __typename
              ... on SectionRecord {
                id
                title
                text
                content {
                  ...on AboutBlockRecord {
                    __typename
                    title
                    text
                  }
                  ...on TitleBlockRecord {
                    id
                    __typename
                    title
                  }
                  ... on LinksToModelRecord {
                    __typename
                    id
                    links {
                      ... on ServiceRecord {
                        __typename
                        id
                        title
                        ctaLink
                        text
                        image {
                          responsiveImage(imgixParams: {fm: jpg, fit: crop}) {
                            ...responsiveImageFragment
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ${responsiveImageFragment}
      ${metaTagsFragment}
    `,
    preview,
    variables: {
      slug: params.slug,
    },
  }

  return {
    props: {
      subscription: preview
        ? {
            ...graphqlRequest,
            initialData: await request(graphqlRequest),
            token: process.env.DATOCMS_API_READONLY_TOKEN,
          }
        : {
            enabled: false,
            initialData: await request(graphqlRequest),
          },
      preview,
    },
  }
}

export default function LandingPage({ subscription }) {
  const {
    data: { site, landingPage },
  } = useQuerySubscription(subscription)

  const metaTags = landingPage.seo.concat(site.favicon)

  return (
    <Layout>
      <Head>{renderMetaTags(metaTags)}</Head>
      <Hero record={landingPage} />
      <StructuredText
        data={landingPage.content}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case "SectionRecord":
              const blocks = record.content.map((rec) => {
                switch (rec.__typename) {
                  case "AboutBlockRecord":
                    return <About record={rec} />
                  case "TitleBlockRecord":
                    return (
                      <Col md={4} key={rec.id}>
                        <h3 className="font-weight-light line-height-1_6 text-dark mb-4">{rec.title}</h3>
                      </Col>
                    )
                  case "LinksToModelRecord":
                    return rec.links.map((link) => {
                      if (link.__typename === "ServiceRecord") {
                        return <Service service={link} />
                      }
                    })
                }
              })

              return (
                <section className="section">
                  <Container>
                    <h2 className="text-lg text-dark text-center mb-4" key={record.id} id={slugify(record.title)}>
                      {record.title}
                    </h2>
                    <p className="text-muted text-center mb-5">{record.text}</p>
                    {blocks.length > 0 && (
                      <Row className="justify-content-center" key={record.id + "-block"}>
                        {blocks}
                      </Row>
                    )}
                  </Container>
                </section>
              )
            default:
              return null
          }
        }}
        customNodeRules={[
          renderNodeRule(isHeading, ({ node, children, key }) => {
            const HeadingTag = `h${node.level}`
            const anchor = toPlainText(node)
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "")

            console.log("foo", anchor)

            return (
              <HeadingTag key={key} id={anchor} className="font-weight-normal text-warning mb-3">
                <a href={`#${anchor}`}>{children}</a>
              </HeadingTag>
            )
          }),
        ]}
      />
    </Layout>
  )
}
