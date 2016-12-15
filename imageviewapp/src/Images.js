import React, {Component} from 'react';
import axios from 'axios';

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
      .get('http://localhost:3001/images')
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