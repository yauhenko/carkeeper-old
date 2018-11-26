import AbstractStore from './AbstractStore';

class News extends AbstractStore {

	endpoint = 'admin/news';

}

export default new News();
