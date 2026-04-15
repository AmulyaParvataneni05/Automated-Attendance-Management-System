import Header from "./Components/Header/Header";
function RootLayout() {
  return (
    <div>
        <Header/>
      <div style={{ minHeight: "100vh" ,padding:"0px 0px"}}>
        <Outlet />
      </div>
    </div>
  );
}
export default RootLayout;