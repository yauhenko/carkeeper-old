import sessions from './models/sessions';

sessions.clean();
setInterval(()=>{sessions.clean()}, 60000);
