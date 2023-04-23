// declare interface AppProps {
//   children?: React.ReactNode; // best, accepts everything React can render
//   childrenElement: JSX.Element; // A single React element
//   style?: React.CSSProperties; // to pass through style props
// }

//@ts-ignore
function test2 (props) {
  
  function suma(n1: number, n2: number) {
    return n1 + n2
  }

  return(
    <h1>{suma(1, 2)} Hola</h1>
  );
}

export default test2