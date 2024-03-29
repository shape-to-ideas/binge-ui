import { Container, Grid, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { config } from '../shared/functions';
import { movieService } from '../shared/services';
import { userLogin } from '../shared/store/actions';
import './Movie.scss';
import { Movies } from '../shared/interfaces';
import {get, map} from 'lodash';

const styles = (theme: any) => ({
  posterContainer: {
    'margin-top': '-15rem'
  }
});

const mapStateToProps = (state: any) => {
  return state;
};

class Movie extends React.Component<any, {movie?: Movies, recommendedTitles: string[], recommendedMovies: any, redirectPath: string, selectedMovie: any}> {
  private config = config();
  
  constructor(props: any) {
    super(props);
    this.state = {
      recommendedTitles: [],
      recommendedMovies: [],
      redirectPath: '',
      selectedMovie: []
    };
  }
  
  public componentDidMount() {
    const movieId = get(this.props, 'match.params.movieId');
    movieService.getMovie(movieId)
        .then((response) => {
          this.setState({...this.state, movie: response.data}, () => {
            this.getMovieRecommendedTitles();
          });
        })
        .catch((e) => console.log(e));
  }
  
  private getMovieRecommendedTitles() {
    movieService.getMovieRecommendations(this.state.movie?.title || '')
      .then((response) => {
        this.setState({...this.state, recommendedTitles: response.data}, () => {
          this.getMovieRecommendations();
        });
      })
      .catch((e) => console.log(e));
  }
  
  private getMovieRecommendations() {
    movieService.getMoviesByTitle(this.state.recommendedTitles)
      .then((response) => {
        this.setState({...this.state, recommendedMovies: response.data});
      })
      .catch((e) => console.log(e));
  }
  
  private renderRecommendations() {
    return map(this.state.recommendedMovies, (movie: Movies) => {
      return (
        <Grid item lg={3} md={3} sm={12} xs={12} key={movie.id}>
          <a href={`${movie.id}`}>
            <img className="poster" src={`${this.config.tmdbImageEndpoint1280}${movie.poster}`} alt=""/>
            <span>{movie.title}</span>
          </a>
        </Grid>
      );
    });
  }
  
  public render() {
    const {classes}: any = this.props;
    if (this.state.redirectPath) {
      return <Redirect to={{pathname: this.state.redirectPath, state: {movie: this.state.selectedMovie}}} push/>;
    } else {
      if (this.state.movie) {
        return <React.Fragment>
          <div className="banner" style={{background: `url("${this.config.tmdbImageEndpoint1280}${this.state.movie.image}") center center / cover`}}/>
          <Container className={classes.posterContainer}>
            <Grid container spacing={3}>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <img className="poster" src={`${this.config.tmdbImageEndpoint1280}${this.state.movie.poster}`} alt=""/>
              </Grid>
          
              <Grid item lg={9} md={9} sm={12} xs={12}>
                <div className="poster-details">
                  <span className="movie-title">{this.state.movie.title}</span>
                  <span className="release-date">{this.state.movie.releaseDate}</span>
                  <Grid container >
                    <Grid item lg={3} md={3} sm={5} xs={5}>
                      <p>Original Language</p>
                      <p>Original Title</p>
                      <p>Popularity</p>
                      <p>Vote Average</p>
                      <p>Vote Count</p>
                    </Grid>
                    <Grid item lg={9} md={9} sm={7} xs={7}>
                      <p>{this.state.movie.originalLanguage}</p>
                      <p>{this.state.movie.originalTitle}</p>
                      <p>{this.state.movie.popularity}</p>
                      <p>{this.state.movie.voteAverage}</p>
                      <p>{this.state.movie.voteCount}</p>
                    </Grid>
                  </Grid>
                </div>
                <div className="synopsis">
                  <h3>Synopsis</h3>
                  {this.state.movie.overview}
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {this.renderRecommendations()}
            </Grid>
          </Container>
        </React.Fragment>;
      } else {
        return '';
      }
    }
  }
  
}

export default connect(mapStateToProps, {userLogin})(withStyles(styles)(Movie));
