import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import Link from "next/link"
import { Image } from "react-datocms"

export default function Hero({ record: { heroTitle, heroSubtitle, heroImage } }) {
  return (
    <section className="position-relative bg-light hero">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="pr-lg-5">
              <h1 className="mb-4 font-weight-normal line-height-1_4">{heroTitle}</h1>
              <p className="text-muted mb-4 pb-2">{heroSubtitle}</p>
              <Link href="#services">
                <a className="btn btn-warning">
                  Find Out More <span className="ml-2">&darr;</span>
                </a>
              </Link>
            </div>
          </Col>
          <Col lg={6}>
            <div className="mt-5 mt-lg-0">
              <Image data={heroImage.responsiveImage} className="img-fluid d-block mx-auto" alt={heroImage.alt} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
