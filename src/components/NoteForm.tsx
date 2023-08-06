import { useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Select, { SelectOption } from "./Select";

const options = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
];

const NoteForm = ({ title = "", markdown = "" }) => {
  const [value1, setValue1] = useState<SelectOption[]>([options[0]]);
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);

  return (
    <Form>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control required defaultValue={title}></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Select
                creatable
                multiple
                options={options}
                Selected={value1}
                setSelected={setValue1}
                handleCreateOption={(option) => {
                  setValue1((value1) => [
                    ...value1,
                    { label: option.label, value: uuidv4() },
                  ]);
                }}
              />
              <br />
              <Select
                options={options}
                Selected={value2}
                setSelected={(o) => setValue2(o)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            required
            as="textarea"
            rows={15}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
};

export default NoteForm;
