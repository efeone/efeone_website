function loadblogs() {
    jQuery.ajax({
      url: 'https://jalebi.efeone.com/api/resource/Blog Post?fields=["meta_image", "title", "blog_intro", "blogger", "published_on", "route"]&filters=[["published", "=", "1"]]&limit_page_length=100',
      type: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token ffceb203fabe2fc:773041385edd49a',
      },
      success: function (response) {
        const apiResult = response.data
        const container = document.getElementById('blogs' ,'recentlist');


        apiResult.forEach((result, idx) => {
          const card = document.createElement('div');
          card.classList = 'card-body';
          const content = `

          <article class="blog-article" data-aos="fade-up" style="    height: 30pc;">
          <div class="float-left w-100 blog--content-wrap">
            <span class="blog-article__image" title="">
              <a>
                <img
                  src="https://jalebi.efeone.com/${result.meta_image}"
                  alt="">
                 </a>
            </span>
          </div>
          <h2 class="blog-article__title mb-0 float-left w-100" >
          ${result.title}
          </h2>

              <p class="blog-article__description mb-4" style="height: 25pc;">${result.blog_intro}</p>
            </div>
          </div>
          <div class="blog-article__info float-left w-100">${result.published_on}

              <div class="blog--info-date">${result.blogger}</div>

            <a href="https://jalebi.efeone.com/${result.route}"
              class="dark-link blog--bottom-link"><i class="fa fa-long-arrow-right" aria-hidden="true"></i> Read
              More</a>
          </div>
        </article>`



              // Append newyly created card element to the container
              container.innerHTML += content;
            })
          }
        });
      }
