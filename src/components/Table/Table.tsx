import { useEffect, useState } from "react";
import {
  Table as TableANT,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
} from "antd";
import employee from "../../store/employee";
import { observer } from "mobx-react-lite";

interface Item {
  key: string;
  surname: string;
  name: string;
  patronymic: string;
  position: string;
  birthDay: any;
  gender: string;
  employmentDate: any;
  dismissalDate: string;
  rights: Array<number>;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Table = observer(() => {
  const [mobData, setMobData] = useState<Item[]>(employee.register);

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...mobData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setMobData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setMobData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Surname",
      dataIndex: "surname",
      width: 150,
      editable: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
      editable: true,
    },
    {
      title: "Patronymic",
      dataIndex: "patronymic",
      width: 150,
      editable: true,
    },
    {
      title: "Position",
      dataIndex: "position",
      width: 150,
      editable: true,
    },
    {
      title: "Birth day",
      dataIndex: "birthDay",
      width: 130,
      editable: true,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 100,
      editable: true,
    },
    {
      title: "Employment date",
      dataIndex: "employmentDate",
      width: 130,
      editable: true,
    },
    {
      title: "Dismissal date",
      dataIndex: "dismissalDate",
      width: 130,
      editable: true,
    },
    {
      title: "Rights",
      dataIndex: "rights",
      width: 150,
      editable: true,
    },
    {
      title: "Collegues",
      dataIndex: "collegues",
      width: 150,
      editable: true,
    },
    {
      title: "Change",
      dataIndex: "operation",
      width: 115,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: "Erase",
      dataIndex: "operation",
      width: 110,
      render: (_: any, record: Item) => {
        return (
          <Button
            onClick={() => {
              const currentLength = +mobData
                .map((item, index) => {
                  let correct;
                  if (item.key === record.key) {
                    correct = index;
                  }
                  return correct
                })
                .filter((el) => el != null);

              mobData.splice(currentLength, 1);
              employee.changeRegister(mobData);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    employee.setLocalStorage();
    console.log(EditableCell);
  }, []);
  useEffect(() => {
    let jsonData = JSON.stringify(employee.register);
    localStorage.setItem("employee", jsonData);
    setMobData(JSON.parse(jsonData));
  }, [JSON.stringify(employee.register)]);

  useEffect(() => {
    employee.changeRegister(mobData);
  }, [JSON.stringify(mobData)]);

  return (
    <>
      <Form form={form} component={false}>
        <TableANT
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={mobData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
});

export default Table;
