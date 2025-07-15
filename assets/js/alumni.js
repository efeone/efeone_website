function totalteams() {
    jQuery.ajax({
      url: 'https://jalebi.efeone.com/api/resource/Employee?fields=[ "employee_name", "designation", "image", "custom_employee_order"]&filters=[["status", "in", ["Left", "Inactive"]]]&limit_page_length=100&order_by=custom_employee_order asc',
      type: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token ffceb203fabe2fc:773041385edd49a'

      },
      success: function (response) {
        const apiResult = response.data
        const container = document.getElementById('alumnilist');


        apiResult.forEach((result, idx) => {
          // Create card element
          const card = document.createElement('div');
          card.classList = 'card-body';

          // Construct card content
          const placeholder = 'https://placehold.co/400x400?text=No+Image';
          let imageUrl = placeholder;
          if (result.image && !result.image.includes('/private/')) {
            imageUrl = `https://jalebi.efeone.com${result.image}`;
          }
          const content = `
          <div class="col-lg-3 col-md-6 d-flex align-items-stretch">
            <div class="member" data-aos="fade-up" data-aos-delay="1">
              <div class="member-img">
                <img src="${imageUrl}" alt="">
              </div>
              <div class="member-info">
                <h4>${result.employee_name}</h4>
                <span>${result.designation}</span>
              </div>
            </div>
          </div>`;


              // Append newyly created card element to the container
              container.innerHTML += content;
            })
          }
        });
      }
