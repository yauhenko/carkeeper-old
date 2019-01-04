import React, {Component, Fragment} from 'react';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import Loader from '../../components/Loader';
import api from '../../utils/api';
import Icon from "../../components/Icon";

@observer
class Stats extends Component {

  @observable loading = false;

  @observable group = "date";
  @observable source = null;
  @observable date_from = null;
  @observable date_till = null;
  @observable sort = "date";
  @observable order = true;

  @observable stats = [];
  @observable sources = [];

  componentDidMount() {
    this.fetch();
  }

  @action fetch = async () => {
    this.loading = true;

    // this.sort = this.group;
    // this.order = this.sort !== "date";

    this.order = false;

    if(this.group === "date") {
      this.sort = "date";
    } else {
      this.sort = "clicks";
    }

    try {
      this.sources = await api("stats/sources", {});

      this.stats = await api("stats", {
        group: this.group,
        source: this.source,
        date_from: this.date_from,
        date_till: this.date_till,
        sort: this.sort,
        order: this.order
      });
    } catch (e) {
      alert(`Ошибка: ${e.message}`)
    }

    this.loading = false;
  };

  render() {
    return (
      <Fragment>
        <div className="pt-3 pb-3">
          <div className="row">
            <div className="col-2">
              <input onChange={(e) => {this.date_from = e.target.value; this.fetch()}} value={this.date_from || ""} className="form-control" type="date"/>
            </div>
            <div className="col-2">
              <input onChange={(e) => {this.date_till = e.target.value; this.fetch()}} value={this.date_till || ""} className="form-control" type="date"/>
            </div>
            <div className="col-2">
              <select onChange={(e) => {this.source = e.target.value; this.fetch()}} className="form-control">
                <option value="">Источник</option>
                {this.sources.map((item)=>(
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="col-6 text-right">
              <button className="btn" onClick={this.fetch}>
                <Icon icon="refresh"/>
              </button>
            </div>
          </div>
        </div>

        {this.loading ? <Loader/> :

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                <tr>
                  <th className="pl-0">
                    <select className="form-control" onChange={(e) => {
                      this.group = e.target.value;
                      this.fetch()
                    }} value={this.group}>
                      <option value="date">Дата</option>
                      <option value="source">Источник</option>
                    </select>
                  </th>
                  <th className="text-right">Клики</th>
                  <th className="text-right">Уники</th>
                  <th className="text-right">Инсталлы</th>
                  <th className="text-right">Запуски</th>
                  <th className="text-right">Машины</th>
                  <th className="text-right">Штрафы</th>
                  <th className="text-right">АвтоКарты</th>
                </tr>
                </thead>
                <tbody>
                {this.stats.length ? this.stats.map((item, key) => (
                        <tr key={key}>
                          <td>{item.title}</td>
                          <td className="text-right">{item.clicks}</td>
                          <td className="text-right">{item.uniqs}</td>
                          <td className="text-right">{item.installs}</td>
                          <td className="text-right">{item.launches}</td>
                          <td className="text-right">{item.cars}</td>
                          <td className="text-right">{item.fines}</td>
                          <td className="text-right">{item.cards}</td>
                        </tr>
                    ))
                    :
                    <tr>
                      <td colSpan={10}><p>Лавэ нанэ, саси кар, саси палэ.</p></td>
                    </tr>
                }
                </tbody>
              </table>
            </div>
        }
      </Fragment>
    );
  }
}

export default Stats;
