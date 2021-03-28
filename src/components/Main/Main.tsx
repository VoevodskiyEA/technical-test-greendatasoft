import { useState } from "react";
import employee from "../../store/employee";
import { observer } from "mobx-react-lite";
import Table from "../Table/Table";
import NewRow from "../NewRow/NewRow";
import { Layout, Button, Typography } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface Props {}

const Main = observer((props: Props) => {
  const [showNewRow, setShowNewRow] = useState(false);
  return (
    <div className="main">
      <Layout className="main__layout">
        <Header className="main__layout__header"><Title id="brand">GreenData</Title></Header>
        <Content className="main__layout__content">
          <Button onClick={() => setShowNewRow(!showNewRow)}>Add new</Button>
          <Button onClick={() => employee.setDefaultLocalStorage()}>
            Set default localStorage
          </Button>
          <NewRow display={showNewRow} />
          <Table />
        </Content>
        <Footer className="main__layout__footer" style={{}}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </div>
  );
});

export default Main;
