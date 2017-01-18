import React from 'react';
import {
	Link
} from 'react-router';
import CollectItem from './CollectItem';
import CollectActions from '../../actions/CollectActions';
import CollectStores from '../../stores/CollectStore';
class CollectList extends React.Component {
	constructor(props) {
		super(props);
		this.state = CollectStores.getState();
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
		CollectStores.listen(this.onChange);
		var currentUser = {
			name:'胡和浩的爷爷'
		}
		CollectActions.getCollectInfoByUser(currentUser);
	}

	render(){
		var data = this.state.data;
		var collectList;
		var collects = data.collect;
		if(collects){
			collectList = collects.map((collectArticle)=>(
				<li>
					<CollectItem title={collectArticle.articleTitle} time={collectArticle.collectTime}/>
				</li>
			));
		}
		return ( <div className="collect-list">
			<ul>
				{collectList}
			</ul>
		</div> )
}
}
export default CollectList;