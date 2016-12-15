import React, {Component} from 'react';
import axios from 'axios';
import mqtt from 'mqtt';

let service = "http://10.22.0.127:3001/images"

const client = mqtt.connect('mqtt://10.22.0.204:1883')
client.on('connect', function() {
  client.subscribe('robot/service');
});

client.on('message', function(topic, message) {
  console.log(`Received ${message} on topic ${topic}`)
  if (topic === 'robot/service') {
    try {
      let payload = JSON.parse(message);
      if (payload.service && payload.service === 'images') {
        console.log("Setting service url to " + payload.url);
        service = payload.url;
      }
    }
    catch (e) {
      console.log(e);
    }
  }
});

class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: []
    };

    this.fetchImages = this.fetchImages.bind(this);
  }

  componentDidMount() {
    this.ticker = setInterval(this.fetchImages, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  fetchImages() {
    const self = this;
    axios
      .create({
        // baseURL: 'http://localhost:3001',
        timeout: 1000
      })
      .get(service)
        .then(function(resp) {
          self.setState({
            images: resp.data.images
          });
          return resp.data.images;
        })
        .catch(function(err) {
          console.log(err);
          self.setState({
            images: []
          });
          return [];
        });
  }

  render() {
    let elems = this.state.images.map(image => { return (
      <div className="image-box" key={image.id}>
        <img role="presentation" className="image" src={image.url}/>
      </div>
    )});

    return (
      <div className="images-container">
        {elems}
      </div>
    );
  }
}

export default Images;