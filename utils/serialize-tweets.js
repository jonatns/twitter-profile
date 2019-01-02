import Link from 'next/link';

export default text => {
  const cleanedText = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
  const partsByUsername = cleanedText.split(/(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9_]+)/);

  for (let i = 1; i < partsByUsername.length; i += 2) {
    partsByUsername[i] = (
      <Link href={`/search?q=${partsByUsername[i]}`} key={i}>
        <a href={`/search?q=${partsByUsername[i]}`} className="tweet-links">
          @{partsByUsername[i]}
        </a>
      </Link>
    );
  }

  return partsByUsername;
};
