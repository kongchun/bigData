import React from 'react';
import {
	Link
} from 'react-router';
import CollectItem from './CollectItem';
import UserStoreActions from '../../actions/UserStoreActions';
import UserStore from '../../stores/UserStore';
class CollectList extends React.Component {
	constructor(props) {
		super(props);
		this.state = UserStore.getState();
		this.onChange = this.onChange.bind(this);
	}
	onChange(state) {
		this.setState(state);
	}
	componentWillMount(){
	    /**
		 * 1.根据名称查询当前用户的信息
		 * 2.根据查询到的Id去查询文章内容
		 * */
		UserStore.listen(this.onChange);
		UserStoreActions.getUser();
	}
	componentWillUnmount() {
		UserStore.unlisten(this.onChange);
	}

	render(){
		var height = (document.documentElement.clientHeight-50) + "px";
		var data = this.state.data;
		var collectList;
		var collects = data.collect;
		var styleApp = {
			backgroundColor:"#FFFFFF",
			minHeight:height
		}
		if(collects.length > 0){
			console.log(collects);
			collectList = collects.map((collectArticle)=>(
				<li>
					<CollectItem articleid={collectArticle.articleId} title={collectArticle.articleTitle} time={collectArticle.collectTime} thumbnail={collectArticle.thumbnail}/>
				</li>
			));
		}else{
			let height = (document.documentElement.clientHeight-50) + "px";
			let styles = {
				backgroundColor:"#FFFFFF",
				height:height,
				lineHeight:height,
				textAlign:"center",
				fontSize:"16px"
			}
			collectList = <div style={styles}>还没有收藏过文章</div>
		}
		return ( <div className="collect-list" style={styleApp}>
			<ul>
				{collectList}
			</ul>
		</div> )
}
}
export default CollectList;
