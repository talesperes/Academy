import React, { Component } from 'react';
import SidebarFilter from '../../components/SidebarFilter/index';

import {
	InnerContent,
	TitleMovieDiv,
	TitleH2,
	ContentContainer,
	Content,
	ColumnDiv,
	Panel,
	Results,
	PageContainer,
	LoadMoreStyled
} from './style';

import renderMoviesCard from '../../components/MovieCard/renderMoviesCard';

export default class Movie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			movies: [],
			totalPages: 0,
			page: 1,
			sort: '',
			filter: ''
		};
		this.loadMore = this.loadMore.bind(this);
		this.onFilter = this.onFilter.bind(this);
		console.log(this.state.sort);
	}

	componentDidMount() {
		this.getContent();
	}

	async getContent() {
		try {
			const { page, movies, totalPages, sort, filter } = this.state;
			const response = await fetch(
				`http://localhost:8080/movies?&page=${page}?&language=pt-BR&sort_by=${sort}&include_adult=false&include_video=false&with_genres=${filter}`
			);
			const data = await response.json();
			const dataResults = data.results;
			const totalPage = data.total_pages;

			this.setState({
				movies: [...movies, ...dataResults],
				totalPages: totalPages + totalPage
			});
		} catch (error) {
			console.error(error);
		}
	}

	loadMore() {
		this.setState({ page: this.state.page + 1 }, this.getContent);
	}

	onFilter(state) {
		const { sort, filter } = state;
		this.setState(
			{
				...this.state,
				sort,
				filter
			},
			this.getContent
		);
		console.log('sort', sort, 'filter', filter);
	}

	render() {
		const { page, totalPages } = this.state;
		const hasMore = page < totalPages;
		const { movies } = this.state;
		return (
			<>
				<InnerContent>
					<ContentContainer>
						<TitleMovieDiv>
							<TitleH2>Filmes Populares</TitleH2>
						</TitleMovieDiv>
						<Content>
							<div>
								<SidebarFilter onFilter={this.onFilter} />
							</div>
							<div>
								<ColumnDiv>
									<Panel>
										<Results>
											<PageContainer>
												{movies.map(renderMoviesCard)}
											</PageContainer>
											{hasMore && (
												<LoadMoreStyled onClick={this.loadMore}>
													Carregar Mais
												</LoadMoreStyled>
											)}
										</Results>
									</Panel>
								</ColumnDiv>
							</div>
						</Content>
					</ContentContainer>
				</InnerContent>
			</>
		);
	}
}
