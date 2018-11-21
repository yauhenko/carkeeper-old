import AbstractStore from './AbstractStore';

class Users extends AbstractStore {

	endpoint = 'admin/users';

}

export default new Users();
