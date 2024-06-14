function loadteams() {
    jQuery.ajax({
      url: 'https://jalebi.efeone.com/api/resource/Employee?fields=[ "employee_name", "designation", "image", "custom_employee_order"]&filters=[["status", "=", "Active"]]&limit_page_length=100&order_by=custom_employee_order asc',
      type: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token ffceb203fabe2fc:773041385edd49a',
      },
      Credential: "include",
      cookie: "sid=Guest; system_user=no; full_name=Guest; user_id=Guest; user_image=",
      success: function (response) {
        const apiResult = response.data
        const container = document.getElementById('teamlist');


        apiResult.forEach((result, idx) => {
          // Create card element
          const card = document.createElement('div');
          card.classList = 'card-body';

          // Construct card content
          const content = `

          <div class="mt-4 col-6 col-sm-4 col-lg-2 text-center" data-aos="fade-up" style="padding: inherit;">
          <img class="card card-md w-100" loading="lazy"  style="height: 0;
                  padding-top: 100%;
                  background-image: url('https://jalebi.efeone.com${result.image}');
                  background-position: center;
                  background-size: cover;">
          <h6 class="mt-2">${result.employee_name}</h6>
          <p class="text-muted" style="font-size: 0.875rem">
          ${result.designation}
              </p>
              </div>`


              // Append newyly created card element to the container
              container.innerHTML += content;
            })
          }
        });
      }
