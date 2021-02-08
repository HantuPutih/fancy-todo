const base_url = "https://todo-yang-mewah.herokuapp.com/"

    $('#register-page').hide()
    $('#addTodo').hide()
    $('#putTodo').hide()

    function authenticate() {
      if (!localStorage.getItem("token")) {
        $('#login-page').show()
        $('#addTodo').hide()
        $('#todoCard').hide()
        $('nav.navBar').hide()
        $('#putTodo').hide()
        $('hr').show()
      } else {
        $('#register-page').hide()
        $('#putTodo').hide()
        $('hr').hide()
        $('#addTodo').hide()
        $('#login-page').hide()
        $('#todoCard').show()
        $('nav.navBar').show()
        getAllTodos()
      }
    }

    function login() {
      const email = $('#emailLogin').val();
      const password = $('#passwordLogin').val();
      $.ajax({
        url: base_url + "user/login",
        method: "POST",
        data: {
          email,
          password
        }
      })
      .done((response) => {
        localStorage.setItem('token', response.token)
        authenticate()

      })
      .fail((xhr, text) => {
        let timerInterval
          Swal.fire({
            title: xhr.responseJSON.error,
            html: 'please check your credentials!',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
      })
      .always(()=>{
        $('emailLogin').val("")
        $('passwordLogin').val("")
      })
    }

    function register() {
      const email = $('#emailRegister').val();
      const password = $('#passwordRegister').val();
      $.ajax({
        url: base_url + "user/register",
        method: "POST",
        data: {
          email,
          password
        }
      })
      .done((response) => {
        $('#register-page').hide()
        $('#login-page').show()

      })
      .fail((xhr, text) => {
        let timerInterval
          Swal.fire({
            title: xhr.responseJSON.error,
            html: 'please check your credentials!',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
        console.log(base_url);
        console.log(xhr, text);
      })
      .always(()=>{
        $('emailRegister').val("")
        $('passwordRegister').val("")
      })
    }
    
    function addNewTodo() {
      const title = $('#title').val()
      const description = $('#description').val()
      const due_date = $('#due_date').val()
      $.ajax({
        url: base_url + 'todos',
        method: "POST",
        data: {
          title,
          description,
          due_date,
        },
        headers: {
          token: localStorage.getItem('token')
        }
        
      })
      .done((data)=>{
        authenticate()
        $('#addTodo').hide()
        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
      })
      .fail((xhr, text)=>{
        let timerInterval
          Swal.fire({
            title: xhr.responseJSON.error,
            html: 'please check your input!',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
        console.log(xhr, text);
      })
      .always(()=> {
        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
      })
    }

    function getAllTodos() {
      $.ajax({
        url: base_url + 'todos',
        method: "GET",
        headers: {
          token: localStorage.getItem("token")
        }
      })
      .done(response => {
        $('#todoCard').empty()
        $("#todoCard").prepend(`
        <div class="container">
          <div class="col s12 m5 middleintext">
            <div class="card-panel teal">
              <span class="white-text flow-text"><q>${response[0].content}</q>
              </span>
              <p class="white-text">-${response[0].author}</p>
            </div>
          </div>
        </div>
        `)

        if (response[1].length == 0) {
          $("#todoCard").append(`
          <h3 class="middleintext" > What is your main focus for today?</h3>
          <h5 class="middleintext" >add new todo from the navigation bar above</h5>
          `)
        } else {
          response[1].forEach(value =>{
          const status = value.status == true ? "Done" : 'Not Done'
          $("#todoCard").append(`
          <div id="card-${value.id}" >
          <div class="container" >
          <div class="col s12 m6" >
            <div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <span class="card-title "><b> - ${value.title.toUpperCase()} - </b></span>
                <p class="flow-text" > ${value.description}</p>
                  <br>
                  <p>status: <b>${status}</b> </p>
                  <p>due date: <b>${value.due_date.split('T')[0]}</b></p>
                </div>
                <div class="card-action">
                  <a href="#"> <button class="btn" onclick="patchTodo(${value.id})">mark as done</button> </a>
                  <a href="#"> <button class="btn" onclick="editTodo(${value.id})">edit</button> </a>
                  <a href="#"> <button class="btn red" onclick="destroy(${value.id})">delete</button></a>
                </div>
              </div>
            </div>
          </div>
          </div>
          `)
        })
        }
        
      })
      .fail((xhr, text)=>{
        console.log(xhr, text);
      })
    }

    
    function editTodoPost(id) {
      let title = $('#editTitle').val()
      let description = $('#editDescription').val()
      let due_date = $('#editDue_date').val()
      let status = $('input[name="editStatus"]:checked').val();
      $.ajax({
        url: base_url + 'todos/' + id,
        method: "PUT",
        data: {
          title,
          description,
          due_date,
          status
        },
        headers : {
          token: localStorage.getItem("token")
        }
      })
      .done(response => {
        $('#putTodo').empty()
        authenticate()
        
      })
      .fail((xhr, text) => {
        let timerInterval
          Swal.fire({
            title: xhr.responseJSON.error,
            html: 'please check your input!',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
        console.log(xhr, text);
      })
    }

    //edit todo
    //finone -> patch    
    function patchTodo(id) {
      $.ajax({
        url: base_url + "todos/" + id,
        method: "PATCH",
        data: {
          status: true
        },
        headers: {
          token: localStorage.getItem("token")
        }
      })
      .done(response => {
        let timerInterval
          Swal.fire({
            title: "Marked As Done!",
            html: 'what do you want to do next?',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
        authenticate()
      })
      .fail((xhr, text) => {
        console.log(xhr, text);
      })
    }


    function editTodo(id) {
      $('#putTodo').show()
      $('#putTodo').empty()
      $.ajax({
        url: base_url + 'todos/' + id,
        method: "GET",
        headers: {
          token: localStorage.getItem("token")
        }
      })
      .done(response => {
        const statusTrue = response.status == true ? "checked" : ''
        const statusFalse = response.status == false ? "checked" : ''

        $('#todoCard').hide()
        $('#putTodo').append(`
        <h2> Edit My Todo </h2>
        <form  class="middleintext">
        <div id="edit-page">
            <div class="container ">
              <input id="editTitle" type="text" class="validate" name="editTitle"  value="${response.title}">
              <label class="active" for="editTitle" >Edit Title</label>
            </div>
          </div>
          <div class="container">
            <div class="input-field col s6">
              <input id="editDescription" type="text" class="validate" name="editDescription" value="${response.description}">
              <label class="active" for="Edit Description">edit Description</label>
            </div>
          </div>
          <div class="container">
            <div class="input-field col s6">
              <input id="editDue_date" type="date" class="validate" name="editDue_date" value="${response.due_date.split('T')[0]}">
              <label class="active" for="editDue_date">Edit due date</label>
            </div>
          </div>

          <label class="active" for="editStatus" >Edit Status </label>
              <p>
                <label>
                  <input  name="editStatus"type="radio" ${statusTrue}  value="true"/>
                  <span>Done</span>
                </label>
              </p>
              <p>
                <label>
                  <input name="editStatus" type="radio" ${statusFalse} value="false"/>
                  <span>Not Done</span>
                </label>
              </p>
          </div>
          <button id="editTodo" class="waves-effect waves-light btn" type="button" onclick="editTodoPost(${response.id})">Edit todo</button>

          <button id="cancelEdit" onclick="authenticate()"class="waves-effect waves-light btn middleintext" type="button" >Cancel</button>
          </form>
        `)
      })
      .fail((xhr, text) => {
        console.log(xhr, text);
      })
    } 

    function destroy(id) {
      $.ajax({
        url: base_url + "todos/" + id,
        method: "DELETE",
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .done(()=>{
        $(`#card-${id}`).remove()
        authenticate()
        let timerInterval
          Swal.fire({
            title: "Deleted!",
            html: 'add new todo from the navigation bar',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
      })
      .fail((xhr,text)=>{
        console.log(xhr, text);
      })
    }


    function logout() {
      $('#todoCard').empty()
      $('#putTodo').empty()
      localStorage.clear()
      var auth2 = gapi.auth2.getAuthInstance()
      auth2.signOut().then(()=>{
        console.log('User singed out');
      })

      authenticate()
    }
    function onSignIn(googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      $.ajax({
        url: base_url + 'user/googleLogin',
        method: "POST",
        data: {
          googleToken: id_token
        }
      })
      .done(response=>{
        localStorage.setItem('token', response.token)
        authenticate()
      })
      .fail(err => {
        console.log(err);
      })
    }

    //*********************************************************************************/
    $(document).ready(()=>{
      $('#register-page').hide()
      $('#login-page').show()
      authenticate()
      //show register/login
      $("button.switchbtn").on('click', (event)=> {
        event.preventDefault()
        $('#register-page').toggle()
        $('#login-page').toggle()
      })

      $('#loginFormBtn').on('click', (event)=> {
        event.preventDefault()
        login()
      })

      $('#register-btn').on('click', (event) => {
        event.preventDefault()
        register()
      })

      $("#addTodoBtn").on('click', (event)=> {
        event.preventDefault()
        $('#putTodo').hide()
        $('#login-page').hide()
        $('#register-page').hide()
        $('#todoCard').hide()
        $('#addTodo').show()
      })
      $("#myTodo").on('click', (event)=>{
        event.preventDefault()
        $('#putTodo').hide()
        $('#login-page').hide()
        $('#register-page').hide()
        $('#todoCard').show()
        $('#addTodo').hide()
      })

      $('#addNewTodo').on('click', (event)=>{
        event.preventDefault()
        addNewTodo()
      })

      $('#logout').on('click', (event)=> {
        event.preventDefault()
        logout()
      })
    })
