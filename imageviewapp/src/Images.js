import React, {Component} from 'react';
import axios from 'axios';
import mqtt from 'mqtt';
import Modal from 'react-modal';
import Dump from './Dump';

const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(211, 211, 211, 0.10)'
  },
  content : {
    border                : 'solid 3px black',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '600px'
  }
};

let service = "http://10.22.0.127:3001/images"

const client = mqtt.connect('mqtt://10.22.0.204:9001')
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
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.analyse = this.analyse.bind(this);
  }

  componentDidMount() {
    this.ticker = setInterval(this.fetchImages, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  openModal(e) {
    if (!e.target.src) {
      return;
    }

    this.setState({
      // url: e.target.src,
      modalIsOpen: true
    });
  }

  analyse(e) {
    let url = e.target.src;
    let key = url.replace(/.*test/, "")

    console.log("Analysing " + key);
    const self = this;
    axios
      .create({
        timeout: 10000
      })
      .get(service + "/" + key)
        .then(function(resp) {
          console.dir(resp.data["Labels"]);
          self.setState({
            recognized: resp.data["Labels"]
          });
        })
        .catch(function(err) {
          console.log(err);
        });

  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  fetchImages() {
    const self = this;
    axios
      .create({
        // baseURL: 'http://localhost:3001',
        timeout: 10000
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
    let ai = this.state.recognized ?
              this.state.recognized
              .map(elem => {
                return (<label>{elem["Name"]} ({elem["Confidence"]})</label>);
              }).map(res => <div>{res}</div>)
              : <div></div>
    console.log(ai);
    let elems = (<div>...waiting for robot to send images</div>);
    elems = this.state.images.sort().reverse().map(image => { return (
      <div className="image-box" key={image.id} onClick={this.analyse}>
        <img role="presentation" className="image" src={image.url}/>
      </div>
    )});

    return (
      <div>
      <div className="images-container">
        {elems}
      </div>
      <div className="ai">
          {ai}
        </div>
      </div>
    );
  }
}

export default Images;