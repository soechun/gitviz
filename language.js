function processLanguages(result) {
    var temp = [];
        for(var i=0; i < result.length; i++) {
            var item = result[i]
            var languages = $.ajax({
                url:item['languages_url']+"?access_token=97642aeb49b46b4815569d492d3380e53129b90e",
                async: false
            }).responseJSON;
            for(var key in languages) {
                temp.push({
                    repo: item.name,
                    langugae: key,
                    bytes: languages[key]
                })
            }
        }
    return temp
}
$.ajax({
    url:
    "https://api.github.com/users/torvalds/repos?access_token=97642aeb49b46b4815569d492d3380e53129b90e",
    success: function(result) {
        
        console.log(processLanguages(result));
    }
})
