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
    // let d = JSON.stringify(this.state.details);
    let elems = (<div>...waiting for robot to send images</div>);
    elems = this.state.images.sort().reverse().map(image => { return (
      <div className="image-box" key={image.id} onClick={this.openModal}>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Image details"
          style={customStyles}
        >
          <h2>Image details</h2>
          <div>
            <Dump url={image.url}/>
          </div>
          <button onClick={this.closeModal}>close</button>
        </Modal>
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