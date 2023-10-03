const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <strong>total of {sum}</strong>

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) =>
    <>
        {parts.map((part) => <Part key={`part-${part.id}`} part={part} />)}
    </>

const Course = ({ course }) => (
    <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((prev, curr) => prev + curr.exercises, 0)} />
    </div>
)

export default Course