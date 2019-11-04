export default (Vue) => {
    Vue.directive('height',{
        inserted(el, binding){ 
            if(typeof binding.value == 'number'){
                // 如果传值的情况 是总高 减 传进来的值
                $(el).css(binding.name, $(window).height() - binding.value)
            }else{
                // 如果没传值的情况 是总高
                $(el).css(binding.name, $(window).height())
            }
        }
    })
}