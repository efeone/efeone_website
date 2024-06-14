function project() {   
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
}