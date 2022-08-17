import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../../utils/mutations";
import { QUERY_THOUGHTS, QUERY_ME } from "../../utils/queries";

const ThoughtForm = () => {
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {

            try {
                // update me array's cache
                const { me } = cache.readQuery({ query: QUERY_ME });
                cache.writeQuery({
                    query: QUERY_ME,
                    data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
                });
            } catch (error) {
                console.warn('First thought insertion by user!')
            }

            // update thought array's cache
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

            cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: { thoughts: [addThought, ...thoughts] }
            });
        }
    });
    const [thoughtText, setText] = useState("");
    const [characterCount, setCharacterCount] = useState(0);

    const handleChange = (e) => {
        if(e.target.value.length <= 280){
            setText(e.target.value);
            setCharacterCount(e.target.value.length);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            await addThought({
                variables: { thoughtText }
            });
            setText("");
            setCharacterCount(0);
        } catch (error) {
            console.error(error);
        }

        
    };
    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}></textarea>
                    <button className="btn col-12 col-md-3" type="submit">
                        Submit
                    </button>
            </form>
        </div>
    )
};

export default ThoughtForm;