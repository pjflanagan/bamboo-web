
import React from 'react';

import { Button, Row, Col } from 'app/elements';

import Style from './style.module.scss';

export const RowAddNew = () => {
  return (
    <Row className={`${Style.rowButton} ${Style.rowAddNew}`}>
      <Col className={Style.colButton}>
        <Button className={Style.button}>{'Add New'}</Button>
      </Col>
    </Row>
  );
}
