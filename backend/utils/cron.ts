import sessions from '../models/sessions';

setInterval(sessions.clean, 60000);
