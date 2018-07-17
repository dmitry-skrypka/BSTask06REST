(function () {

    let loginbt = document.getElementById('loginbtn'),
        user = {},
        $loginPage = $('.login-page'),
        $chatPage = $('.chat'),

        $usernameInput = $('#username'),
        $nameInput = $('#name'),
        message_list = document.getElementById('chath');
    user_list = document.getElementById('usersl');


    // let ajaxRequest = function (options) {
    //     let url = options.url || '/';
    //     let method = options.method || 'GET';
    //     let callback = options.callback || function () {
    //     };
    //     let data = options.data || {};
    //     let xmlHttp = new XMLHttpRequest();
    //
    //     xmlHttp.open(method, url, true);
    //     xmlHttp.setRequestHeader('Content-Type', 'application/json');
    //     xmlHttp.send(JSON.stringify(data));
    //
    //     xmlHttp.onreadystatechange = function () {
    //         if (xmlHttp.status == 200 && xmlHttp.readyState === 4) {
    //             callback(xmlHttp.responseText);
    //         }
    //     }
    // };


    loginbt.onclick = function (e) {
        e.preventDefault();
        let value = $(e.target).attr('class');
        let selector = '.' + value;
        let usernickname = $(selector + ' [name=username]').val();
        let name = $(selector + ' [name=name]').val();


        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                username: cleanInput($usernameInput.val().trim()),
                name: cleanInput($nameInput.val().trim()),
            }, success: (res) => {

                $loginPage.fadeOut();
                $chatPage.show();
                $loginPage.off('click');

                user = {
                    username: res.username,
                    name: res.name
                };

                getUsers();
                getHistory()

            },
            error: (res) => {
                alert(response(res));
            }

        })
    };


    let getUsers = function () {
        $.ajax({
            url: '/users',
            type: 'GET',
            success: (res) => {

                clear(user_list)
                for (let users of res) {
                    addUsers(users);


                }


            },
            error: (res) => {

            }

        })
    };
    let getHistory = function () {
        $.ajax({
            url: '/messages',
            type: 'GET',
            success: (res) => {


                if (res.length > 0) {
                    clear(message_list);
                    for (let message of res) {
                        addMessage(message);
                    }
                }


            },
            error: (res) => {
                alert(response(res));
            }

        })
    };


    function addMessage(message) {


        message.date = (new Date(message.date)).toLocaleString();
        message.username = cleanInput(message.username);
        message.content = cleanInput(message.content);
        myname = cleanInput(user.username);
        console.log(myname);


        let li = createNode("li"),
            message_data = createNode("div"),
            message_data_name = createNode("span"),
            message_data_time = createNode("span"),
            message_data_content = createNode("div");

        li.setAttribute("class", "");
        message_data.setAttribute("class", "message-data");
        message_data_name.setAttribute("class", "message-data-name");
        message_data_time.setAttribute("class", "message_data_time");
        message_data_content.setAttribute("class", "message my-message");
        if (message.content.includes('@' + myname)) {
            li.setAttribute("class", "tome");
        }
        message_data_name.innerHTML = message.username;
        message_data_time.innerHTML = message.date;
        message_data_content.innerHTML = message.content;

        append(message_data, message_data_name);
        append(message_data, message_data_time);
        append(li, message_data);
        append(li, message_data_content);


        $(li).appendTo('.chat-history ul');

        // $(".chat-history").animate({scrollTop: $('.chat-history')[0].scrollHeight}, 500);


    }

    function addUsers(users) {

// debugger



        let li = createNode("li"),
            message_data = createNode("div"),
            user_data_name = createNode("span"),
            user_data_username = createNode("span");


        li.setAttribute("class", "");
        user_data_name.setAttribute("class", "message_data_time");


        user_data_username.innerHTML = users.username;
        user_data_name.innerHTML = users.name;


        append(message_data, user_data_username);
        append(message_data, user_data_name);
        append(li, message_data);


        $(li).appendTo('.chat-users ul');




    }


    $('.chat-message button').on('click', e => {
        e.preventDefault();

        let selector = $("textarea[name='message']");
        let messageContent = selector.val().trim();

        if (messageContent !== '') {

            $.ajax({
                url: '/messages',
                type: 'POST',
                data: {
                    message: messageContent,
                    user: user.username

                },
                success: (res) => {

                    addMessage(res)

                },
                error: (res) => {
                    alert(response(res));
                }

            });

            selector.val('');
        }
    });


    setInterval(function () {
        getUsers();
        getHistory();
    }, 5000);

    function createNode(element) {
        return document.createElement(element);
    }

    function append(parent, el) {
        return parent.appendChild(el);
    }

    function clear(parentElem) {

        let element = parentElem;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }
})();
