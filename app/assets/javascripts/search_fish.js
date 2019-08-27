$(window).load(function(){
  var searchHtml = $("#find_fishes");
  var findFishHtml = $("#fish-search-list");
  function addHTML(fish){
    var html = `<div class="fish_search__right__add clearfix">
                  <p class="fish-index-add"data-fish-id=${fish.id} data-fish-name=${fish.name}>${fish.name}</p>
                </div>`;
    searchHtml.append(html);
  };
  function addAllPosts(post){
    var html = `<div class="post-content">
                  <div class="post-content__item">
                  <a href="/posts/${post.id}">
                  <div class="post_content__title">
                    ${post.title}
                  </div>
                  <div class="post__content__image">
                      <img src=${post.image}></img>
                  </div>
                  <div class="post__content__info">
                    <div class="post__content__info__pref">
                      ${post.pref}
                    </div>
                    <div class="post__content__info__time">
                      ${post.time}
                    </div>
                  </div>
                </a>
              </div>
            </div>`
      return html;
  }
  function addNoImagePosts(post){
    var html = `<div class="post-content">
                  <div class="post-content__item">
                  <a href="/posts/${post.id}">
                  <div class="post_content__title">
                    ${post.title}
                  </div>
                  <div class="post__content__image">
                  <image class="noimage-tag" height="200" src="noimage.png" width="200"></image>
                  </div>
                  <div class="post__content__info">
                    <div class="post__content__info__pref">
                      ${post.pref}
                    </div>
                    <div class="post__content__info__time">
                      ${post.time}
                    </div>
                  </div>
                </a>
              </div>
            </div>`
      return html;
  }
  function fishAddHTML(id,name){
    var html = `<div class='fish-find__right__add'>
                  <input name="post[fish_ids][]" value=${id} type="hidden" class="fish-input-id"></input>
                  <p class='fish-index-find-add fish-search-remove fish-search-add'>${name}</p>
                </div>`
    findFishHtml.append(html)
  };
  
  function adderrHTML(message){
    var html = `<div class="fish-search__right">
                  <p class="fish-search__right__name">${message}</p>
                </div>`
    return html;           
  };

  $("#fish-find-field").on("keyup", function(){
    var input = $("#fish-find-field").val();
    if(input.length === 0){
      $("#find_fishes").children().remove();
      return false;
    }else{
    $.ajax({
      url: "/fish/find_fish",
      type: "GET",
      data: { keyword: input },
      dataType: "json"
    })
    .done(function(fishes){
      $("#find_fishes").children().remove();
      if (fishes.length !== 0){
        fishes.forEach(function(fish){
          addHTML(fish);
          });
      }else{
        adderrHTML("一致する魚がいません");
      };
      $(".fish-index-add").on("click", function(){
        $(this).parent().remove();
        var fish_id = $(this).data("fish-id");
        var fish_name = $(this).data("fish-name");
        fishAddHTML(fish_id,fish_name);
      });
    })
    .fail(function(){
      alert("魚名検索に失敗しました")
    });
  };
  });
  var searchPosts = function(){
    var pref = $("#search_prefecture_id").val();
    var city = $("#search_city_id").val();
    var fishes = []
    $(".fish-input-id").each(function(){
      fishes.push($(this).val());
    });
    $.ajax({
      url: "/posts/find_posts",
      type: "get",
      data: {
        prefecture_id: pref,
        city_id: city,
        fish_ids: fishes
      },
      dataType: "json"
    })
    .done(function(posts){
      $(".posts-container").children().remove();
      posts.forEach(function(post){
        if(!post.image){
          var html = addNoImagePosts(post);
          $(".posts-container").append(html)
        }else{
          var html = addAllPosts(post);
          $(".posts-container").append(html)
        }
      })
    })
    .fail(function(){
      adderrHTML("投稿に失敗しました")
    });
  }
  $("#fish-find-field").on("change",searchPosts);
  $("#search_city_id").on("change",searchPosts);
  $("#search_prefecture_id").on("change",searchPosts);
});