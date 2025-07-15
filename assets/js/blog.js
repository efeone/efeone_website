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
        const container = document.getElementById('blogs');
        container.innerHTML = ''; // Clear existing static content

        apiResult.forEach((result, idx) => {
          const imageUrl = result.meta_image ? `https://jalebi.efeone.com/${result.meta_image}` : 'https://placehold.co/600x400/EEE/31343C?text=Efeone';

          const card = document.createElement('div');
          card.className = 'col-lg-4 col-md-6 mb-4'; // Use Bootstrap grid

          const content = `
          <article class="blog-article h-100 d-flex flex-column" data-aos="fade-up">
            <div class="blog-article__image">
              <a href="https://jalebi.efeone.com/${result.route}" target="_blank">
                <img src="${imageUrl}" alt="${result.title}" class="img-fluid">
              </a>
            </div>
            <div class="blog-article__content">
              <h2 class="blog-article__title">
                <a href="https://jalebi.efeone.com/${result.route}" target="_blank">${result.title}</a>
              </h2>
              <p class="blog-article__description">${result.blog_intro || ''}</p>
            </div>
            <div class="blog-article__info mt-auto">
              <span>${formatDate(result.published_on)} | ${result.blogger}</span>
              <a href="https://jalebi.efeone.com/${result.route}" target="_blank">Read More</a>
            </div>
          </article>`;

          card.innerHTML = content;
          container.appendChild(card);
        });
      },
      error: function(err) {
        console.error("Failed to load blogs:", err);
        const container = document.getElementById('blogs');
        container.innerHTML = '<p class="text-center">Failed to load blog posts. Please try again later.</p>';
      }
    });
}

/**
 * Format date from "YYYY-MM-DD" to "DD-MM-YYYY"
 * @param {str} dateStr - The date string in "YYYY-MM-DD" format
 * @returns {str} - The formatted date string in "DD-MM-YYYY" format
 */
function formatDate(dateStr) {
  // Example input: "2025-07-15"
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr; // fallback

  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
}
