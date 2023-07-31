import tiny from "tiny-json-http"

export async function request({ query, variables, preview }) {
  let endpoint = "https://graphql.datocms.com"

  if (process.env.NEXT_DATOCMS_ENVIRONMENT) {
    endpoint += `/environments/${process.env.NEXT_DATOCMS_ENVIRONMENT}`
  }

  if (preview) {
    endpoint += `/preview`
  }

  const { body } = await tiny.post({
    url: endpoint,
    headers: {
      authorization: `Bearer ${process.env.DATOCMS_API_READONLY_TOKEN}`,
    },
    data: {
      query,
      variables,
    },
  })

  if (body.errors) {
    console.error("Ouch! The query has some errors!")
    console.error(body.errors)
    throw body.errors
  }

  return body.data
}
