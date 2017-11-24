let PageBody = (props) => {
	let { users, theme } = props

	return (
		<body>
			<div>
				<div className="title" style={{ fontSize: 30 }}>用户列表</div>
				<table className={(theme == "dark") ? 'tbl-dark' : 'tbl-light'}>

					<tr>
						<th>ID</th>
						<th>姓名</th>
						<th>年龄</th>
						<th>性别</th>
					</tr>

					{users.map(user => <tr>
						<td>{user.id}</td>
						<td>{user.name}</td>
						<td>{user.age}</td>
						<td>{user.gender || '未知'}</td>
					</tr>)}

				</table>
			</div>
		</body>
	)
}

module.exports = function (data) {
	return "<!doctype html>" + (
		<html>
			<head>
				<script src="xxxxx"></script>
				<meta charset="UTF-8" />
				<title>用户列表</title>
			</head>
			<PageBody users={data.users} theme="dark" />
		</html>
	)
}