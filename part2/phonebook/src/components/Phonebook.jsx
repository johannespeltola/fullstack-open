const uniqueId = () => Math.random().toString(16).slice(2)

const Phonebook = ({ persons, filter, onDelete }) => (
  <>
    {persons
      .filter((p) => p.name.toLowerCase().search(filter.toLowerCase()) >= 0)
      .map((p) =>
        <p
          key={`${uniqueId()}-${p.name}`}
        >
          {`${p.name} ${p.number}`} <button onClick={() => onDelete(p)}>delete</button>
        </p>
      )}
  </>
)
export default Phonebook