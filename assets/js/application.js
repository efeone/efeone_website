/**
 * Application Form
 */
function loadjobs() {
    jQuery.ajax({
      url: 'https://jalebi.efeone.com/api/resource/Job Opening?fields=[ "name", "job_title", "description", "vacancies"]&filters=[["status", "=", "Open"]]',
      type: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token ffceb203fabe2fc:773041385edd49a',
      },
      success: function (response) {
        const apiResult = response.data
        const container = document.getElementById('accordion');

        apiResult.forEach((result, idx) => {
          // Create card element
          const card = document.createElement('div');
          card.classList = 'card-body';

          // Construct card content
          const content = `
          <div class="container-xxl py-5">
            <div class="container">
                <div class="tab-class text-center wow fadeInUp" data-wow-delay="0.3s">
                    <div class="tab-content">
                        <div class="row g-4" style="border:1px solid; border-radius:10px; padding: 20px;">
                            <div class="col-sm-12 col-md-9 d-flex align-items-center">
                                <div class=" ps-8 justify-text">
                                    <h5 class="mb-3">${result.job_title}</h5>
                                    <p>${result.description}</p>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-3 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                                <div class="d-flex mb-3">
                                    <a class="btn btn-primary" href="https://jalebi.efeone.com/jobs">Apply Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
          container.innerHTML += content;
        })
      }
    });
  }
