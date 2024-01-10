export async function loader() {
  let temp: number | undefined = undefined;

  if (foo()) {
    // condition?
    temp = 2;
  }

  console.log(temp);
  if (!temp) {
    console.log("temp is null");
  }

  return null;
}

function foo(): true | false {
  return true;
}
