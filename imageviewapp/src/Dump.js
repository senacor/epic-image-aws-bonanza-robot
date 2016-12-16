import React, {Component} from 'react';
import axios from 'axios';

const service = "http://localhost:3001/images";
class Dump extends Component {
  constructor(props) {
    super(props)
    this.state = { details: {}};
  }

  componentDidMount() {
    this.fetchImages()
  }

  componentWillUnmount() {
    this.setState({});
  }

  fetchImages() {
    let key = this.props.url.replace(/.*test/, "")

    const self = this;
    axios
      .create({
        timeout: 10000
      })
      .get(service + "/" + key)
        .then(function(resp) {
          self.setState({
            details: resp.data
          });
          return resp.data;
        })
        .catch(function(err) {
          console.log(err);
          self.setState({
            details: {}
          });
          return {};
        });

  }

  generateElemsForObject(obj) {
    return Object.keys(obj)
          .map(key => {
            let inner = JSON.stringify(obj[key]);
            return (
              <div className="details" key={key}>
                <label><b>{key}</b>:
                </label>
                {inner}
              </div>
            )
          });
  }

  render() {
    let labels = this.state.details['labels'];
    if (!labels) {
      return (<div></div>)
    }
    let e = this.generateElemsForObject(labels);
    return (
      <div>
        {e}
      </div>
    )
  }
}

export default Dump;