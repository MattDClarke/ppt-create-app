import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';

const LoaderThreeDots = ({ height, width }) => (
  <Loader type="ThreeDots" color="#9e9e9e" height={height} width={width} />
);
LoaderThreeDots.defaultProps = {
  height: 30,
  width: 30,
};

LoaderThreeDots.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};
export default LoaderThreeDots;
