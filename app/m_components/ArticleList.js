import React from 'react';
import {
    Link
    } from 'react-router';
import {
    browserHistory
    } from 'react-router';

import ArticleListStore from '../stores/ArticleListStore';
import ArticleListActions from '../actions/ArticleListActions';
import Pages from './Pages';
import Weixin from './Weixin';
class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = ArticleListStore.getState();
        this.onChange = this.onChange.bind(this);
        this.limit = 7;
        this.page = props.params && props.params.page ? parseInt(props.params.page) : 1;
        this.url = window.location.href;
        if(this.url.indexOf("?_k")!=-1){
            this.url = this.url.split("?_k")[0];
        }
        this.pagePath = window.sessionStorage.getItem("data_pagePath");
    }

    componentDidMount() {
        console.log("ArticleList", "componentDidMount");

        ArticleListStore.listen(this.onChange);

        var that = this;
        var data = window.sessionStorage.getItem("data");

        if(!!data){
            this.state.data = JSON.parse(data);
            this.setData(JSON.parse(data));
            var pagePath = window.sessionStorage.getItem("data_pagePath");
            if(!!pagePath && "null"!=pagePath){
                browserHistory.push(pagePath);
                this.page = parseInt(window.sessionStorage.getItem("data_pageNum"));
            }
            var transformIndex = window.sessionStorage.getItem("urlScroll_"+this.url);
            if(!!transformIndex){
                $("html,body").animate({scrollTop: transformIndex}, 10);
            }
        }else{
            const page = 1;
            ArticleListActions.getArticles(page, this.limit);
            $("html,body").animate({scrollTop: 0}, 10);
        }
        $(".pagination").on('click',function(){
            that.setPage();
            browserHistory.push('#/page/'+that.page);
            that.pagePath = '#/page/'+that.page;
            ArticleListActions.getMoreArticles(that.getPage(), that.limit).then(
                    data => that.addNewArticle(data.data)
            );
        })
        Weixin.getUrl();
        Weixin.weixinReady()
    }

    componentWillUnmount() {
        window.sessionStorage.removeItem("data");
        window.sessionStorage.removeItem("data_pagePath");
        window.sessionStorage.removeItem("data_pageNum");
        window.sessionStorage.setItem("data",JSON.stringify(this.state.data));
        window.sessionStorage.setItem("data_pagePath",this.pagePath);
        window.sessionStorage.setItem("data_pageNum",this.page);
        window.sessionStorage.removeItem("urlScroll_"+this.url);
        window.sessionStorage.setItem("urlScroll_"+this.url,document.body.scrollTop);
        ArticleListStore.unlisten(this.onChange);
    }

    //componentDidUpdate(prevProps) {
    //    const lastPage = prevProps.params && prevProps.params.page ? prevProps.params.page : 1;
    //    const page = this.props.params && this.props.params.page ? this.props.params.page : 1;
    //    if (lastPage != page) {
    //        ArticleListActions.getArticles(this.props.params.page, this.limit);
    //    } else {
    //        scroll(0, 0);
    //    }
    //
    //}

    setData(news){
        this.setState({
            data:{
                data:news.data,
                count:news.count
            }});
    }

    onChange(state) {
        this.setState(state);

    }

    getPage() {
        return this.page
    }
    setPage() {
        this.page = this.page + 1;
    }

    getThumbnail(article) {
        var thumbnail = article.thumbnail;
        if (thumbnail != "") {
            return (<div className="featured-media">
                <Link to={'/article/' + article.id}><img src={thumbnail} alt={article.title}/></Link>
            </div>)
        }
        return "";
    }
    addNewArticle(news){
        this.setState({
            data:{
                data:this.state.data.data.concat(news)
            }});
    }
    render() {
        function subContent(str) {
            return str.substr(0, 200);
        }
        function readTime(time){
            //let data = new Date(time);
            let diff = (new Date().getTime() - parseInt(time))/1000;
            let aDate = 86400;
            let aHour = 3600;
            if(diff < aHour){
                let minute = Math.ceil(diff/36);
                return minute + "分钟前"
            }
            if(diff < aDate){
                let hour = parseInt(diff/aHour);
                return hour + "小时前"
            }
            if(diff < 2*aDate){
                return "1天前"
            }
            if(diff < 3*aDate){
                return "2天前"
            }
            if(diff < 4*aDate){
                return "3天前"
            }
            if(diff < 5*aDate){
                return "4天前"
            }
            if(diff < 6*aDate){
                return "5天前"
            }
            if(diff < 7*aDate){
                return "6天前"
            }
            if(diff < 8*aDate){
                return "7天前"
            }
            if(diff < aDate*30){
                return "7天以前"
            }
            if(diff < aDate*60){
                return "一个月前"
            }
            return "a天前";
        }
        function markTag(tags){
            var i =0;
            return tags.map((tag) => (
                <span key={i++} className="article-tag">{tag}</span>
            ))
        }
        let articles = this.state.data.data;
        let cookie;
        if(document.cookie.split("articles=")[1] && document.cookie.split("articles=")[1] != ""){
            cookie = JSON.parse(unescape(document.cookie.split("articles=")[1].split(";")[0]))
        }else{
            cookie = []
        }
        let cookie_art = new Set(cookie);
        let that = this;
        let artclelist = articles.map(function(article){
            let title_class = "";
            if(cookie_art.has(article.id)){
                title_class = "read";
            }
            return <article key={article.id} id={article.id} className='post animated fadeIn'>

                {that.getThumbnail(article)}
                <div className="intro">
                    <div className="post-head">
                        <h3 className="post-title"><Link className={title_class} to={'/article/' + article.id}>{article.title}</Link></h3>
                    </div>
                    <div className="post-content">
                        <p>{subContent(article.content)}</p>
                    </div>
                    <div className="post-permalink">
                        <Link to={'/article/' + article.id} className="info">
                            {readTime(article.createDate)}
                        </Link>{markTag(article.tags)}
                    </div>
                </div>
            </article>
        });
        return (
            <section className="content-wrap">
                <div className="container">
                    <div className="row list">
                        <main className="col-md-12 main-content ">
                            {artclelist}
                        </main>
                        <ul className="pagination">
                            <li>
                                再来七篇
                            </li>
                        </ul>
                    </div>

                </div>
            </section>
        );
    }
}

export default ArticleList;