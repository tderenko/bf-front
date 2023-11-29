(function () {
    let UserView = {
        searchByName: null,
        namesList: null,
        userData: null,
        init: function () {
            this.searchByName = document.getElementById('search-by-name');
            this.namesList = document.getElementById('user-list');
            this.progress = document.getElementById('progress');
            this.userData = document.getElementById('user-data');
            this.events();
        },
        loadUserByName: function (name) {
           this.client('https://tderenko.github.io/bf-front/response.json', 'GET', {name}, function (response) {
                this.namesList.innerHTML = '';
                if (response !== null && response !== undefined) {
                    response
                    .filter(el => `${el.given_name} ${el.family_name}`.toLowerCase().indexOf(name.toLowerCase()) !== -1)
                    .forEach(el => {
                        let item = this.createTag('li', `${el.given_name} ${el.family_name}`);
                        item.addEventListener('click', this.showUser.bind(this, el));
                        this.namesList.appendChild(item);
                        this.namesList.style.display = 'block';
                    });
                }
           });
        },
        user: function (data) {
            let user = this.createTag('div', null, {class: 'user-block'});
            return user;
        },
        events: function () {
            if (this.searchByName !== null && this.searchByName !== undefined) { 
                this.searchByName.addEventListener('input', () => {
                    if (this.searchByName.value.trim().length < 2) {
                        this.namesList.innerHTML = '';
                    }

                    if (this.timer) {
                        clearTimeout(this.timer);
                    }

                    this.timer = setTimeout(() => this.loadUserByName(this.searchByName.value), 700);
                });
            }

            if (this.searchByName !== null && this.searchByName !== undefined) {
                this.searchByName.addEventListener('focus', () => {
                    if (this.namesList.childNodes.length) {
                        this.namesList.style.display = 'block';
                    }
                });
            }
        },
        client: function (url, method, data, callback) {
            this.progress.style.display = 'block';
            var xhr = new XMLHttpRequest();
            data = Object.keys(data).map(k => k + '=' + data[k]).join('&');
            if (method.toUpperCase() === 'GET') {
                url += '?' + data;
            }
            xhr.open(method, url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    		xhr.responseType = 'json';
            xhr.onload = () => {
                callback.call(this, xhr.response);
                this.progress.style.display = 'none';
            };
            xhr.send(data);
        },
        createTag: function (tag, text, attr) {
            let el = document.createElement(tag);
            if (attr) {
                for (let val in attr) {
                    el.setAttribute(val,attr[val]);
                }
            }
            if (text) {
                if (typeof text === 'object') {
                    el.appendChild(text);
                } else {
                    el.innerHTML = text;
                }
            }
            return el;
        },
        showUser: function (user) {
            this.namesList.style.display = 'none';
            this.userData.innerHTML = '';
            this.userData.appendChild(this.createTag('div', `UserID: ${user.user_id}`));
            this.userData.appendChild(this.createTag('div', `Email: ${user.email}`));
            this.userData.appendChild(this.createTag('div', `Name: ${user.given_name} ${user.family_name}`));
            this.userData.appendChild(this.createTag('div', `Nickname: ${user.nickname}`));
            this.userData.appendChild(this.createTag('div', `Last Login: ${user.last_login}`));
        }
    };

    UserView.init();
}())
