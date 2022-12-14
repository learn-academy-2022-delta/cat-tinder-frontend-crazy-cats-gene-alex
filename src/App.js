import { Component } from "react";
import './App.css'
import Header from "./components/header";
import Footer from "./components/footer";
import CatEdit from "./pages/CatEdit";
import CatIndex from "./pages/CatIndex";
import CatNew from "./pages/CatNew";
import CatShow from "./pages/CatShow";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cats: []
    }
  }

  componentDidMount(){
    this.readCat()
  }

  readCat = () => {
    fetch("http://localhost:3000/cats")
    .then(response => response.json())
    .then(catsArray => this.setState({cats: catsArray}))
    .catch(errors => console.log("Cat read errors:", errors))
  }
  
  createCat = (cat) => {
    fetch("http://localhost:3000/cats", {
      body: JSON.stringify(cat),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    .then(response => response.json())
    .then(() => this.readCat())
    .catch(errors => console.log("Cat create errors", errors))
  }

  updateCat = (cat, id) => {
    fetch(`http://localhost:3000/cats/${id}`, {
      body: JSON.stringify(cat),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    })
    .then(response => response.json())
    .then(() => this.readCat())
    .catch(errors => console.log("Cat update errors:", errors))

  }

  deleteCat = (id) => {
    fetch(`http://localhost:3000/cats/${id}`, {
      headers: {
        "Contet-Type": "application/json"
      },
      method: "DELETE"
    })
    .then(response => response.json())
    .then(() => this.readCat())
    .catch(errors => console.log("delete errors:", errors))

    console.log("deleted", id)
  }

  render() {
    // console.log(this.state.cats)
    return(
      <>
      <Router> 
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/catindex" render={(props) => <CatIndex cats={this.state.cats}/>} />
          <Route path="/catshow/:id" render={(props) => {
            let id = +props.match.params.id
            let cat = this.state.cats.find(cat => cat.id === id)
            return <CatShow deleteCat={this.deleteCat} cat={cat} />
          }} />
          <Route path="/catnew" render={(props) => <CatNew createCat={this.createCat} />} />
          <Route path="/catedit/:id" render={(props) => {
            let id = +props.match.params.id
            let cat = this.state.cats.find(cat => cat.id === id)
            return <CatEdit updateCat={this.updateCat} cat={cat} />
          }} />
          <Route component={NotFound}/>
        </Switch>
        <Footer />
      </Router>
      </>
    )
  }
}

export default App