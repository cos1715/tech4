import { Component } from '@angular/core';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.toggle.css', './app.component.details.css']
})

export class AppComponent {

  public xhr;

  public users = [];
  public usersOnPage = [];

  public organizations = [];
  public orgsOnPage = [];

  public filteredUsers = [];
  public filteredOrgs = [];

  public userIndex = 10;
  public orgIndex = 10;

  public userDetails;
  public userDetailsFollowers;
  public userDetailsFollowing;
  public userDetailsGists;
  public userDetailsRepos;
  public userDetailsSub;
  public userDetailsOrgs;

  public date;
  public isUser = true;
  public filterFlag = false;
  public userDetailsFlag = false;


  constructor() {
    const apiData = ajax('https://api.github.com/users');
    apiData.subscribe(res => {
      this.xhr = res.response;
      this.xhr.forEach(item => {
        if (item.type === 'User') {
          this.users.push(item);
        } else {
          this.organizations.push(item);
        }
      });

      this.users.forEach((item, i) => {
        if (i < 10) {
          this.usersOnPage.push(item);
        }
      });

      this.organizations.forEach((item, i) => {
        if (i < 10) {
          this.orgsOnPage.push(item);
        }
      });
    });
  }

  selectType() {
    this.isUser = !this.isUser;
  }

  showHide() {
    this.userDetailsFlag = !this.userDetailsFlag;
  }

  onSearch(str: string) {
    if (str !== ``) {
      this.filterFlag = true;

      if (this.isUser) {
        this.filteredUsers = this.users.filter(item => {
          if (item.login.search(str) > -1) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        this.filteredOrgs = this.organizations.filter(item => {
          if (item.login.search(str) > -1) {
            return true;
          } else {
            return false;
          }
        });
      }
    } else {
      this.filterFlag = false;
    }
  }

  showDetail(obj) {
    this.showHide();
    this.userDetails = this.getApi(obj.url);
    this.userDetailsFollowers = this.getApi(obj.followers_url);
    obj.following_url = obj.following_url.slice(0, obj.following_url.indexOf(`{`));
    this.userDetailsFollowing = this.getApi(obj.following_url);
    obj.gists_url = obj.gists_url.slice(0, obj.gists_url.indexOf(`{`));
    this.userDetailsGists = this.getApi(obj.gists_url);
    this.userDetailsRepos = this.getApi(obj.repos_url);
    this.userDetailsSub = this.getApi(obj.subscriptions_url);
    this.userDetailsOrgs = this.getApi(obj.organizations_url);
    this.date = new Date(this.userDetails.created_at);
    this.date = this.date.toDateString();
  }

  getApi(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status !== 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      return JSON.parse(xhr.responseText);
    }
  }

  increase() {
    if (this.isUser) {
      if (this.userIndex + 10 < this.users.length + 2) {
        const x = this.userIndex;
        this.usersOnPage = [];
        this.userIndex += 10;
        this.users.forEach((item, i) => {
          if (i >= x && i < this.userIndex) {
            this.usersOnPage.push(item);
          }
        });
      }
    } else {
      if (this.userIndex + 10 < this.organizations.length) {
        const x = this.orgIndex;
        this.orgsOnPage = [];
        this.orgIndex += 10;
        this.organizations.forEach((item, i) => {
          if (i >= x && i < this.orgIndex) {
            this.orgsOnPage.push(item);
          }
        });
      }
    }
  }

  decrease() {
    if (this.isUser) {
      if (this.userIndex !== 10) {
        const x = this.userIndex - 10;
        const y = x - 10;
        this.usersOnPage = [];
        this.userIndex -= 10;
        this.users.forEach((item, i) => {
          if (i >= y && i < x) {
            this.usersOnPage.push(item);
          }
        });
      }
    } else {
      if (this.orgIndex !== 10) {
        const x = this.orgIndex - 10;
        const y = x - 10;
        this.orgsOnPage = [];
        this.orgIndex -= 10;
        this.organizations.forEach((item, i) => {
          if (i >= y && i < x) {
            this.orgsOnPage.push(item);
          }
        });
      }
    }
  }

}
