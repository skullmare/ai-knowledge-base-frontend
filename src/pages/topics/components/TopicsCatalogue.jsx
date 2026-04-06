export function TopicsCatalogue({ groupedTopics }) {
    return (
        <div className="topics-page__grid">
            {groupedTopics.map(({ category, topics }) => (
                <div key={category._id} className="topics-page__group">
                    <h2 className="topics-page__group-title">{category.name}</h2>
                    <ul className="topics-page__list">
                        {topics.map((topic) => (
                            <li key={topic._id} className="topics-page__item">
                                {topic.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}