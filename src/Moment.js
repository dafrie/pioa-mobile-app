// TODO: No locale support, unecessary bloat
//import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
//import moment from 'moment-timezone/builds/moment-timezone-with-data';


// Sets the moment instance to use.
Moment.globalLocale = 'en';
//Moment.globalMoment = moment;
//Moment.globalLocale = 'de';
//Moment.globalLocale = getCurrentLocale();
Moment.globalFormat = 'D MMM YYYY - HH:mm';

export default Moment;
