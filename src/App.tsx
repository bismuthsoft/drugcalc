import { Layout, Menu } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import './App.css'

const { Header, Content } = Layout;

function App() {
  return (
    <>
      <Header className="header">
        <div className="logo"
             title="Drug Calculator">
          DrugCalc
        </div>
        <Menu
          className="header-menu"
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: 1,
              label: <Link to="/recipes">Recipes</Link>,
            },
            {
              key: 2,
              label: <Link to="/ingredients">Ingredients</Link>,
            },
            {
              key: 3,
              label: <Link to="/containers">Containers</Link>,
            },
          ]}
        />
      </Header>
      <Layout>
        <Content><Outlet /></Content>
      </Layout>
    </>
  );
}

export default App;
