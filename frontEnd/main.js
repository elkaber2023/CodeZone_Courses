const url = "http://localhost:5000/api/courses";

fetch(url)
  .then((res) => res.json())
  .then((data) => console.log(data));
