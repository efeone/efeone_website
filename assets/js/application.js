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
         <div class="wpb_column vc_column_container vc_col-sm-4" data-aos="fade-up">
          <div class="vc_column-inner   vc_custom_1617894477724 vc_custom_1617894477724">
              <div class="wpb_wrapper">
                  <div class="key-icon-box icon-default icon-top cont-left ib-hover-1    with-border   kd-animated fadeInUp" style="background-color: #f7f7f7;border: 1px solid #e7e7e7;margin-bottom:30px;" data-animation-delay=200>
                      <div class="fullwidth-image">
                          <div class="tt-iconbox-customimg">
                              <img width="2560" height="1440" src="https://acabesinternational.com/wp-content/uploads/2022/04/working-code-scaled.jpg" class="attachment-full" alt="" decoding="async" loading="lazy" title="Working on code" srcset="https://acabesinternational.com/wp-content/uploads/2022/04/working-code-scaled.jpg 2560w, https://acabesinternational.com/wp-content/uploads/2022/04/working-code-300x169.jpg 300w, https://acabesinternational.com/wp-content/uploads/2022/04/working-code-1024x576.jpg 1024w, https://acabesinternational.com/wp-content/uploads/2022/04/working-code-768x432.jpg 768w, https://acabesinternational.com/wp-content/uploads/2022/04/working-code-1536x864.jpg 1536w, https://acabesinternational.com/wp-content/uploads/2022/04/working-code-2048x1152.jpg 2048w" sizes="(max-width: 2560px) 100vw, 2560px"/>
                          </div>
                      </div>
                      <div class="ib-wrapper" style="padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;text-align:justify;font-size:14px">
                          <h4 class="service-heading">${result.job_title}</h4>
                          <ul class="ib-list">
                           
                          <p>${result.description}</p>
                          <div class="ib-button-wrapper">
                              <a class="tt_button tt_primary_button btn_primary_color hover_solid_secondary" 
                              href="https://jalebi.efeone.com/job_application/new?job_title=${result.name}" target="_self">Apply Now!</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`
  
  
          // Append newyly created card element to the container
          container.innerHTML += content;
        })
      }
    });
  }
  