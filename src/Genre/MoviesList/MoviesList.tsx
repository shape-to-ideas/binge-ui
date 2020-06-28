import { Container, Snackbar } from '@material-ui/core';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './MoviesList.scss';
import axios from 'axios';
import { get } from 'lodash';
import { config } from '../../shared/functions';
import { Movies } from '../../shared/interfaces';

class MoviesList extends React.Component<any, {open: boolean, alertMsg: string, movieList: Movies[]}> {
  private config = config();
  
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      alertMsg: '',
      movieList: []
    };
    this.handleClose = this.handleClose.bind(this);
    this.getMovieList();
  }
  
  private async getMovieList() {
    const genreId = get(this.props, 'match.params.genreId');
    if (genreId) {
      axios.get(`${this.config.serverEndpoint}/movie/genre/${genreId}`)
        .then((response: any) => {
          this.setState({...this.state, movieList: response.data});
        })
        .catch((err) => this.showAlert(err.message));
    }
  }
  
  private showAlert(msg: string) {
    this.setState({...this.state, open: true, alertMsg: msg});
  }
  
  private handleClose() {
    this.setState({...this.state, open: false});
  }
  
  private renderMovieOverview(overview: string) {
    const limit = 24;
    const splitArray = overview.split(' ');
    let overviewString = splitArray.splice(0, limit).join(' ');
    if (splitArray.length > limit) {
      overviewString += '...';
    }
    return overviewString;
  }
  
  private renderGrid() {
    return this.state.movieList.map((movie: Movies, index) => <Grid key={index} item lg={4} md={4} sm={12} xs={12}>
      <div className="grid-container">
        <div className="image" style={{background: `url("${this.config.tmdbImageEndpoint}/${movie.image ? movie.image : movie.poster}") center center / cover`}}/>
        <div className="details">
          <h3>{movie.title}</h3>
          <span className="description">{this.renderMovieOverview(movie.overview)}</span>
          <div className="footer">
            <span className="rating">{movie.voteAverage} ({movie.voteCount} votes)</span>
            <span className="options">
            <FontAwesomeIcon icon={faCheck}/>
          </span>
          </div>
        </div>
      </div>
    </Grid>);
  }
  
  public render() {
    return <React.Fragment>
      <Snackbar open={this.state.open} message={this.state.alertMsg} onClose={this.handleClose}/>
      <Container>
        <Grid container spacing={3}>
          {this.state.movieList.length > 0 ? this.renderGrid() : ''}
        </Grid>
      </Container>
    </React.Fragment>;
  }
}

export default MoviesList;