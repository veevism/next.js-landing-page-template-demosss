import React from "react"
import { Row, Col } from "react-bootstrap"
import { Image } from "react-datocms"
import Link from "next/link"

export default function Service({ service }) {
  return service.id % 2 !== 0 ? (
    <Row className="align-items-center mt-5 text-left" key={service.id}>
      <Col md={5}>
        <Image data={service.image.responsiveImage} className="img-fluid d-block mx-auto" alt={service.image.alt} />
      </Col>
      <Col md={{ size: 6, offset: 1 }}>
        <div className="mt-5 mt-sm-0 mb-4 text-left">
          <h5 className="text-dark font-weight-normal mb-3 pt-3">{service.title}</h5>
          <p className="text-muted mb-3 f-15">{service.text}</p>
          <Link href={service.ctaLink}>
            <a className="f-16 text-warning">
              Try It Now <span className="right-icon ml-2">&#8594;</span>
            </a>
          </Link>
        </div>
      </Col>
    </Row>
  ) : (
    <Row className="align-items-center mt-5 text-left" key={service.id}>
      <Col md={6}>
        <div className="mb-4 text-left">
          <h5 className="text-dark font-weight-normal mb-3 pt-3">{service.title}</h5>
          <p className="text-muted mb-3 f-15">{service.text}</p>
          <Link href={service.ctaLink}>
            <a className="f-16 text-warning">
              Try It Now <span className="right-icon ml-2">&#8594;</span>
            </a>
          </Link>
        </div>
      </Col>
      <Col md={{ size: 5, offset: 1 }} className="mt-5 mt-sm-0">
        <Image data={service.image.responsiveImage} className="img-fluid d-block mx-auto" alt={service.image.alt} />
      </Col>
    </Row>
  )
}
