function load_main_data() {
  jQuery.ajax({
    url: "https://jalebi.efeone.com/api/resource/Project?limit_page_length=1000",
    type: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'token ffceb203fabe2fc:773041385edd49a',
    },
    success: function (response) {
      const project_count = response.data.length
      const get_projects = document.getElementById('projects');
      get_projects.innerText = project_count
    }
  });

  jQuery.ajax({
    url: "https://jalebi.efeone.com/api/resource/Customer?limit_page_length=1000",
    type: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'token ffceb203fabe2fc:773041385edd49a',
    },
    success: function (response) {
      const customer_count = response.data.length
      const get_customers = document.getElementById('customer');
      get_customers.innerText = customer_count
    }
  });

  jQuery.ajax({
    url: 'https://jalebi.efeone.com/api/resource/efe Journey?fields=[ "year", "image", "description"]',
    type: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'token ffceb203fabe2fc:773041385edd49a',
    },
    success: function (response) {
      const apiResult = response.data;
      const container = document.getElementById('efe_journey');
      const card = document.createElement('div');
      card.classList = 'card-body';
      var content = `
      <div class="row gutters wow fadeInUp">
      <div class="col-sm-14 col-lg-14 col-md-14 col-sm-14">
      <div class="card-body">
      <div class="timeline" data-aos="fade-up">
      `
      apiResult.forEach((result, idx) => {
        content += `
        <div class="timeline-row">
          <div class="timeline-time" style="display: flex;">
            <img src="https://jalebi.efeone.com/${result.image}" style="width:30%" alt="">
            <h4>${result.year}</h4>
          </div>
          <div class="timeline-dot fb-bg"></div>
          <div class="timeline-content">
            <p>${result.description}</p>
          </div>
        </div>
        `
      });
      content += `
            </div>
          </div>
        </div>
      </div>`
      container.innerHTML += content;
    }
  });
}
