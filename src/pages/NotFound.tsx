import { Result } from 'antd';
import '../styles/common/common.scss';

const NotFound = () => {
  return (
    <div className='container-center' style={{ height: '100%' }}>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
      />
    </div>
  );
};

export default NotFound;
