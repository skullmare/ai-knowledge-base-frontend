import Edit from '@assets/icons/edit-16.svg'
export function TopicsCatalogue({ groupedTopics, categories, onEditCategory }) {
    return (
        <div className="topics-page__grid">
            {groupedTopics.map(({ category, topics }) => (
                <div key={category._id} className="topics-page__group">
                    <div className="topics-page__group-header">
                        <h2 className="topics-page__group-title">{category.name}</h2>
                        <button
                            className="topics-page__group-edit-btn"
                            onClick={() => {
                                const full = categories.find((c) => c._id === category._id) ?? category
                                onEditCategory(full)
                            }}
                            title="Редактировать раздел"
                        >
                            <Edit />
                        </button>
                    </div>
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